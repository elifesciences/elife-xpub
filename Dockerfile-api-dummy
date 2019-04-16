FROM elifesciences/api-dummy:approved
COPY --chown=elife:elife test/data/ data/
EXPOSE 8080
CMD ["php", "-S", "0.0.0.0:8080", "-t", "web/"]