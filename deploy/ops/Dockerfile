FROM postgres:16.12-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
        awscli \
        ca-certificates \
        curl \
        gzip \
        jq \
        tar \
    && rm -rf /var/lib/apt/lists/*

COPY deploy/ops/backup-set.sh /opt/fares/backup-set.sh
COPY deploy/ops/verify-backup.sh /opt/fares/verify-backup.sh
COPY deploy/ops/restore-set.sh /opt/fares/restore-set.sh
COPY deploy/ops/upload-s3.sh /opt/fares/upload-s3.sh

RUN chmod 0755 /opt/fares/*.sh

ENTRYPOINT []
CMD ["bash"]
