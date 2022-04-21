from .models import dataTable
from rest_framework import serializers

class DataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = dataTable
        fields = ['date', 'name', 'count', 'distance']

