FROM python:3.9

WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip3 install -r /code/requirements.txt
COPY ./main.py /code/
COPY ./templates/ /code/templates
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
