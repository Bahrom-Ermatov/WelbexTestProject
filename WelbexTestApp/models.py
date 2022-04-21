from django.db import models

class dataTable(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=50)
    count = models.IntegerField()
    distance = models.FloatField()

 