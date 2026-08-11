ARG FLINK_VERSION
ARG FLINK_IMAGE_VERSION
ARG DINKY_VERSION

FROM flink:${FLINK_IMAGE_VERSION}-scala_2.12-java11
RUN cp /opt/flink/opt/flink-python*.jar /opt/flink/lib/ && cp /opt/flink/opt/flink-table-planner*.jar /opt/flink/lib/ 2>/dev/null || :
ARG FLINK_VERSION
ARG FLINK_CDC_VERSION=3.6.0-1.20
ENV FLINK_VERSION=${FLINK_VERSION}
ENV DINKY_HOME=/opt/dinky/
ENV H2_DB=./tmp/db/h2
ENV JVM_OPTS="-XX:+UseContainerSupport -XX:InitialRAMPercentage=70.0 -XX:MaxRAMPercentage=70.0"


USER root

ADD build/dinky-release*.tar.gz /opt
RUN  mv /opt/dinky-release* /opt/dinky && mkdir /opt/dinky/config/static
ADD  build/dist/ /opt/dinky/config/static

# Flink CDC 3.6 artifacts use a Flink-specific version suffix. Keep the
# connectors in FLINK_HOME/lib; Dinky sees the same files through extends.
RUN set -eux; \
    repository=https://repo.maven.apache.org/maven2/org/apache/flink; \
    for artifact in \
      flink-sql-connector-mysql-cdc \
      flink-sql-connector-postgres-cdc \
      flink-sql-connector-oracle-cdc \
      flink-sql-connector-sqlserver-cdc \
      flink-cdc-pipeline-connector-mysql \
      flink-cdc-pipeline-connector-doris \
      flink-cdc-pipeline-connector-starrocks; do \
      curl --fail --location --retry 3 \
        "${repository}/${artifact}/${FLINK_CDC_VERSION}/${artifact}-${FLINK_CDC_VERSION}.jar" \
        --output "/opt/flink/lib/${artifact}-${FLINK_CDC_VERSION}.jar"; \
    done; \
    release_version="${FLINK_CDC_VERSION%%-*}"; \
    archive="flink-cdc-${FLINK_CDC_VERSION}-bin.tar.gz"; \
    curl --fail --location --retry 3 \
      "https://downloads.apache.org/flink/flink-cdc-${release_version}/${archive}" \
      --output "/tmp/${archive}"; \
    tar -xzf "/tmp/${archive}" -C /tmp; \
    cp "/tmp/flink-cdc-${FLINK_CDC_VERSION}/lib/flink-cdc-dist-${FLINK_CDC_VERSION}.jar" /opt/flink/lib/; \
    rm -rf "/tmp/${archive}" "/tmp/flink-cdc-${FLINK_CDC_VERSION}"

RUN ln -s /opt/flink/lib/* /opt/dinky/extends/flink${FLINK_VERSION}/

WORKDIR /opt/dinky/


RUN mkdir /opt/dinky/customJar && chmod -R 777 /opt/dinky/

EXPOSE 8888

CMD  ./bin/auto.sh startOnPending
