FROM postgres:16.12-bookworm

# Docker Compose file-backed secrets are bind mounts, so their host GID is
# preserved inside the container. GID 10001 is the fixed Odoo runtime group;
# grant postgres supplementary membership so the shared DB password can stay
# root-owned and group-readable instead of world-readable.
RUN groupadd --gid 10001 fares-secrets \
    && usermod --append --groups fares-secrets postgres \
    && id postgres | grep -Eq 'groups=.*10001\(fares-secrets\)'
