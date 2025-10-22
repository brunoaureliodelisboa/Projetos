# Spring Security

Implementação de segurança, autenticação e autorização em aplicações Spring Boot.

## 🔐 Conceitos Fundamentais

### Autenticação vs Autorização
- **Autenticação**: Verificar quem é o usuário (login)
- **Autorização**: Verificar o que o usuário pode fazer (permissões)

## 🎯 Configuração Básica

### Dependência Maven
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## 👤 UserDetailsService

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UsuarioRepository repository;
    
    @Override
    public UserDetails loadUserByUsername(String username) 
            throws UsernameNotFoundException {
        Usuario usuario = repository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException(
                "Usuário não encontrado: " + username));
        
        return User.builder()
            .username(usuario.getEmail())
            .password(usuario.getSenha())
            .roles(usuario.getRoles().toArray(new String[0]))
            .accountExpired(false)
            .accountLocked(false)
            .credentialsExpired(false)
            .disabled(!usuario.isAtivo())
            .build();
    }
}
```

## 🎫 JWT (JSON Web Token)

### Dependências
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

### JWT Util
```java
@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
    
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### JWT Filter
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) 
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            
            if (username != null && 
                SecurityContextHolder.getContext().getAuthentication() == null) {
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    
                    authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

## 🔑 Authentication Controller

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getSenha()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken(request.getEmail());
        
        return ResponseEntity.ok(new JwtResponse(token));
    }
    
    @PostMapping("/registro")
    public ResponseEntity<String> registrar(@Valid @RequestBody RegistroRequest request) {
        // Lógica de registro
        return ResponseEntity.ok("Usuário registrado com sucesso");
    }
}
```

## 🛡️ Anotações de Segurança

### Method Security
```java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
}

@Service
public class ProdutoService {
    
    @PreAuthorize("hasRole('ADMIN')")
    public void deletar(Long id) {
        // Apenas ADMIN pode deletar
    }
    
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Produto> listar() {
        // ADMIN ou USER podem listar
    }
    
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
    public Usuario atualizar(Long id, Usuario usuario) {
        // Usuário pode atualizar apenas seu próprio perfil ou ADMIN qualquer um
    }
}
```

## 📋 Roles e Authorities

```java
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String email;
    private String senha;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "usuario_roles",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome; // ROLE_USER, ROLE_ADMIN, etc.
}
```

## 🔒 Boas Práticas

1. **Criptografar senhas**: Sempre usar BCrypt ou similar
2. **HTTPS**: Usar SSL/TLS em produção
3. **Token expiration**: Definir tempo de expiração apropriado
4. **Refresh tokens**: Implementar para renovação
5. **Rate limiting**: Proteger contra brute force
6. **CORS**: Configurar adequadamente para APIs
7. **Logout**: Invalidar tokens no logout
8. **Auditoria**: Registrar tentativas de login
