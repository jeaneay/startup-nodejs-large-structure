FROM postgres

# Indicate the variables for postgresql database
# Superuser, password, database, persitent
ENV POSTGRES_USER testing
ENV POSTGRES_PASSWORD testing
ENV POSTGRES_DB localDB
ENV PGDATA=/var/lib/postgresql/data/pgdata

# Expose the PostgreSQL port
EXPOSE 5432
