from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import dataTable
from .serializers import DataSerializer
from .forms import UserForm
import datetime

def index(request):
    return render(request, "index.html")

class rowCount(APIView):
    def get(self, request):
        select_column_val = request.GET['select_column_val']
        select_conditional_val = request.GET['select_conditional_val']
        input_text_val = request.GET['input_text_val']

        #Выбрана колонка "Дата"
        if select_column_val=="1" and len(input_text_val)>0:
            #Выбрано условие "Равно"
            if select_conditional_val=="1":
                rowCount = dataTable.objects.filter(date=datetime.datetime.strptime(input_text_val, "%Y-%m-%d")).count()
            #Выбрано условие "Больше"
            elif select_conditional_val=="3":
                rowCount = dataTable.objects.filter(date__gt=datetime.datetime.strptime(input_text_val, "%Y-%m-%d")).count()
            #Выбрано условие "Меньше"
            elif select_conditional_val=="4":
                rowCount = dataTable.objects.filter(date__lt=datetime.datetime.strptime(input_text_val, "%Y-%m-%d")).count()

        #Выбрана колонка "Название"
        elif select_column_val=="2" and len(input_text_val)>0:
            #Выбрано условие "Равно"
            if select_conditional_val=="1":
                rowCount = dataTable.objects.filter(name=input_text_val).count()
            #Выбрано условие "Содержит"
            elif select_conditional_val=="2":
                rowCount = dataTable.objects.filter(name__icontains=input_text_val).count()
            #Выбрано условие "Больше"
            elif select_conditional_val=="3":
                rowCount = dataTable.objects.filter(name__gt=input_text_val).count()
            #Выбрано условие "Меньше"
            elif select_conditional_val=="4":
                rowCount = dataTable.objects.filter(name__lt=input_text_val).count()

        #Выбрана колонка "Количество"
        elif select_column_val=="3" and len(input_text_val)>0:
            #Выбрано условие "Равно"
            if select_conditional_val=="1":
                rowCount = dataTable.objects.filter(count=int(input_text_val)).count()
            #Выбрано условие "Больше"
            elif select_conditional_val=="3":
                rowCount = dataTable.objects.filter(count__gt=int(input_text_val)).count()
            #Выбрано условие "Меньше"
            elif select_conditional_val=="4":
                rowCount = dataTable.objects.filter(count__lt=int(input_text_val)).count()

        #Выбрана колонка "Расстояние"
        elif select_column_val=="4" and len(input_text_val)>0:
            #Выбрано условие "Равно"
            if select_conditional_val=="1":
                rowCount = dataTable.objects.filter(distance=float(input_text_val)).count()
            #Выбрано условие "Больше"
            elif select_conditional_val=="3":
                rowCount = dataTable.objects.filter(distance__gt=float(input_text_val)).count()
            #Выбрано условие "Меньше"
            elif select_conditional_val=="4":
                rowCount = dataTable.objects.filter(distance__lt=float(input_text_val)).count()
        
        else:
            rowCount = dataTable.objects.all().count()

        return Response({"rowCount": rowCount})

class dataList(APIView):
    def get(self, request):
        page_id = request.GET['page_id']
        rows_on_page = request.GET['rows_on_page']
        select_column_val = request.GET['select_column_val']
        select_conditional_val = request.GET['select_conditional_val']
        input_text_val = request.GET['input_text_val']

        start_row =(int(page_id)-1) * int(rows_on_page)
        end_row = start_row + int(rows_on_page)

        #Выбрана колонка "Дата"
        if select_column_val=="1" and len(input_text_val)>0:
            #Выбрано условие "Равно"
            if select_conditional_val=="1":
                data = dataTable.objects.filter(date=datetime.datetime.strptime(input_text_val, "%Y-%m-%d"))[start_row:end_row]
            #Выбрано условие "Больше"
            elif select_conditional_val=="3":
                data = dataTable.objects.filter(date__gt=datetime.datetime.strptime(input_text_val, "%Y-%m-%d"))[start_row:end_row]
            #Выбрано условие "Меньше"
            elif select_conditional_val=="4":
                data = dataTable.objects.filter(date__lt=datetime.datetime.strptime(input_text_val, "%Y-%m-%d"))[start_row:end_row]

        #Выбрана колонка "Название"
        elif select_column_val=="2" and len(input_text_val)>0:
            print("okk")
            #Выбрано условие "Равно"
            if select_conditional_val=="1":
                data = dataTable.objects.filter(name=input_text_val)[start_row:end_row]
            #Выбрано условие "Содержит"
            elif select_conditional_val=="2":
                data = dataTable.objects.filter(name__icontains=input_text_val)[start_row:end_row]
            #Выбрано условие "Больше"
            elif select_conditional_val=="3":
                data = dataTable.objects.filter(name__gt=input_text_val)[start_row:end_row]
            #Выбрано условие "Меньше"
            elif select_conditional_val=="4":
                data = dataTable.objects.filter(name__lt=input_text_val)[start_row:end_row]

        #Выбрана колонка "Количество"
        elif select_column_val=="3" and len(input_text_val)>0:
            #Выбрано условие "Равно"
            if select_conditional_val=="1":
                data = dataTable.objects.filter(count=int(input_text_val))[start_row:end_row]
            #Выбрано условие "Больше"
            elif select_conditional_val=="3":
                data = dataTable.objects.filter(count__gt=int(input_text_val))[start_row:end_row]
            #Выбрано условие "Меньше"
            elif select_conditional_val=="4":
                data = dataTable.objects.filter(count__lt=int(input_text_val))[start_row:end_row]

        #Выбрана колонка "Расстояние"
        elif select_column_val=="4" and len(input_text_val)>0:
            #Выбрано условие "Равно"
            if select_conditional_val=="1":
                data = dataTable.objects.filter(distance=float(input_text_val))[start_row:end_row]
            #Выбрано условие "Больше"
            elif select_conditional_val=="3":
                data = dataTable.objects.filter(distance__gt=float(input_text_val))[start_row:end_row]
            #Выбрано условие "Меньше"
            elif select_conditional_val=="4":
                data = dataTable.objects.filter(distance__lt=float(input_text_val))[start_row:end_row]
        
        else:
            data = dataTable.objects.all()[start_row:end_row]

        serializer = DataSerializer(data, many=True)
        return Response({"data" : serializer.data})






