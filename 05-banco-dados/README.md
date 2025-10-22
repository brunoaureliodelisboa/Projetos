# Banco de Dados e Persistência

Trabalho com bancos de dados relacionais usando JPA/Hibernate e SQL.

## 🎯 Objetivos

- Modelar dados eficientemente
- Implementar persistência com JPA/Hibernate
- Escrever queries otimizadas
- Gerenciar transações
- Estabelecer relacionamentos entre entidades
- Aplicar boas práticas de banco de dados

## 📚 Tecnologias

### JPA (Java Persistence API)
Especificação Java para ORM (Object-Relational Mapping).

### Hibernate
Implementação mais popular da JPA.

### Spring Data JPA
Abstração sobre JPA que simplifica acesso a dados.

## 🏗️ Conceitos Fundamentais

### Entidades
Classes Java mapeadas para tabelas do banco.

### Repositórios
Interfaces para operações CRUD e queries.

### Relacionamentos
- OneToOne (1:1)
- OneToMany (1:N)
- ManyToOne (N:1)
- ManyToMany (N:N)

### Transações
Garantem consistência e integridade dos dados.

## 📊 Estrutura

```
05-banco-dados/
├── jpa-hibernate/       # Mapeamento ORM, entidades, repositórios
└── queries/             # JPQL, SQL nativo, queries customizadas
```

## 💡 Principais Anotações

### Entidade
- `@Entity`: Marca classe como entidade
- `@Table`: Customiza nome da tabela
- `@Id`: Marca chave primária
- `@GeneratedValue`: Estratégia de geração de ID
- `@Column`: Customiza coluna

### Relacionamentos
- `@OneToOne`: Relacionamento 1:1
- `@OneToMany`: Relacionamento 1:N
- `@ManyToOne`: Relacionamento N:1
- `@ManyToMany`: Relacionamento N:N
- `@JoinColumn`: Define coluna de junção
- `@JoinTable`: Define tabela de junção

### Comportamento
- `@Transactional`: Marca método transacional
- `@Query`: Query customizada
- `@Modifying`: Query de modificação
- `@EntityListeners`: Audit listeners

## 🎓 Níveis

- **jpa-hibernate/**: Conceitos de ORM, mapeamento, relacionamentos
- **queries/**: Queries JPQL, SQL nativo, otimização
