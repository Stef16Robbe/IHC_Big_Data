FROM python:latest

COPY data /app/data
COPY scripts/* /app/scripts
COPY tables.yml /app
COPY requirements.txt /app
COPY frontend/src/data /app/frontend/src/data

WORKDIR /app

RUN pip install -r requirements.txt

WORKDIR /app/scripts

ENTRYPOINT [ "python" ]
CMD [ "ihc.py" ]