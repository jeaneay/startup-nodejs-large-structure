FROM postgres

# Indicate the variables for postgresql database
# Superuser, password, database, persitent
ENV POSTGRES_USER omedema
ENV POSTGRES_PASSWORD omedema
ENV POSTGRES_DB omedemaLocalDB
ENV PGDATA=/var/lib/postgresql/data/pgdata

# Expose the PostgreSQL port
EXPOSE 5432
