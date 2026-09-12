FROM ubuntu:noble

ARG TARGETARCH
ARG ODOO_SHA=1a13ceeaee12fe5cc50f287c31f217d4be2a2eaf
ARG FARES_SHA=unknown

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    ODOO_SHA=${ODOO_SHA} \
    FARES_SHA=${FARES_SHA} \
    PATH=/opt/odoo-venv/bin:${PATH}

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        curl \
        fonts-dejavu-core \
        fonts-freefont-ttf \
        fonts-noto-cjk \
        git \
        libffi-dev \
        libjpeg-dev \
        libldap2-dev \
        libpq-dev \
        libsasl2-dev \
        libssl-dev \
        libxml2-dev \
        libxslt1-dev \
        nodejs \
        npm \
        python3 \
        python3-dev \
        python3-pip \
        python3-venv \
        xz-utils \
        zlib1g-dev \
    && npm install --global rtlcss@4.3.0 \
    && rm -rf /var/lib/apt/lists/*

# Keep PDF behavior aligned with the official Odoo 19 container runtime.
RUN if [ -z "${TARGETARCH}" ]; then TARGETARCH="$(dpkg --print-architecture)"; fi \
    && WKHTMLTOPDF_ARCH="${TARGETARCH}" \
    && case "${TARGETARCH}" in \
         amd64) WKHTMLTOPDF_SHA=967390a759707337b46d1c02452e2bb6b2dc6d59 ;; \
         arm64) WKHTMLTOPDF_SHA=90f6e69896d51ef77339d3f3a20f8582bdf496cc ;; \
         ppc64le|ppc64el) WKHTMLTOPDF_ARCH=ppc64el; WKHTMLTOPDF_SHA=5312d7d34a25b321282929df82e3574319aed25c ;; \
         *) echo "Unsupported wkhtmltopdf architecture: ${TARGETARCH}" >&2; exit 1 ;; \
       esac \
    && curl -fsSL -o /tmp/wkhtmltox.deb "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-3/wkhtmltox_0.12.6.1-3.jammy_${WKHTMLTOPDF_ARCH}.deb" \
    && echo "${WKHTMLTOPDF_SHA}  /tmp/wkhtmltox.deb" | sha1sum -c - \
    && apt-get update \
    && apt-get install -y --no-install-recommends /tmp/wkhtmltox.deb \
    && rm -f /tmp/wkhtmltox.deb \
    && rm -rf /var/lib/apt/lists/*

RUN git init /opt/odoo \
    && git -C /opt/odoo remote add origin https://github.com/odoo/odoo.git \
    && git -C /opt/odoo fetch --depth=1 origin "${ODOO_SHA}" \
    && test "$(git -C /opt/odoo rev-parse FETCH_HEAD)" = "${ODOO_SHA}" \
    && git -C /opt/odoo checkout --detach FETCH_HEAD \
    && python3 -m venv /opt/odoo-venv \
    && /opt/odoo-venv/bin/pip install --no-cache-dir --upgrade pip wheel \
    && /opt/odoo-venv/bin/pip install --no-cache-dir -r /opt/odoo/requirements.txt websocket-client \
    && rm -rf /opt/odoo/.git

# Fixed high UID/GID keeps filestore ownership stable across replacement hosts/images.
RUN groupadd --system --gid 10001 odoo \
    && useradd --system --uid 10001 --gid 10001 --home-dir /var/lib/odoo --create-home --shell /usr/sbin/nologin odoo \
    && mkdir -p /mnt/extra-addons /var/lib/odoo \
    && chown -R 10001:10001 /mnt/extra-addons /var/lib/odoo /opt/odoo /opt/odoo-venv

# Only production addons are shipped in the production runtime image.
COPY --chown=10001:10001 addons/fu_core /mnt/extra-addons/fu_core
COPY --chown=10001:10001 addons/fu_retail /mnt/extra-addons/fu_retail
COPY --chown=10001:10001 addons/fu_preorder /mnt/extra-addons/fu_preorder
COPY --chown=10001:10001 addons/fu_production /mnt/extra-addons/fu_production
COPY --chown=10001:10001 addons/fu_business /mnt/extra-addons/fu_business
COPY --chown=10001:10001 addons/fu_public_api /mnt/extra-addons/fu_public_api
COPY --chown=10001:10001 addons/fu_reporting /mnt/extra-addons/fu_reporting
COPY --chown=10001:10001 deploy/odoo/entrypoint.sh /usr/local/bin/fares-odoo-entrypoint

RUN chmod 0755 /usr/local/bin/fares-odoo-entrypoint

VOLUME ["/var/lib/odoo"]
EXPOSE 8069 8072

USER 10001:10001
ENTRYPOINT ["/usr/local/bin/fares-odoo-entrypoint"]
CMD []
