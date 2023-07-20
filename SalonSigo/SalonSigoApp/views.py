from django.shortcuts import render, redirect
from .models import Signing,Procedure
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from datetime import datetime


list_master = ["Яна","Ирина","Анастасия"]

def sort_sign(signings):
    new_signings = list(signings)

    if len(new_signings) > 0:
        time = ':'.join(str(datetime.now()).split(" ")[-1].split(".")[0].split(':')[:-1])
        date = str(datetime.now()).split(" ")[0]
        hours = time.split(':')[0]
        minute = time .split(':')[1]
        for sign in signings:
            if str(sign.date) == date:
                time_sign = ':'.join(str(sign.time).split(':')[:-1])
                hours_sign = time_sign.split(':')[0]
                minute_sign = time_sign.split(':')[1]
                if hours_sign < hours:
                    new_signings.remove(sign)
                if  hours_sign == hours:
                    if minute_sign < minute:
                        new_signings.remove(sign)

    new_signings = sorted(new_signings, key=lambda x: x.time)

    return new_signings
  
# Create your views here.
master_id = 2
def show_magazine(request):
    
    global master_id
    context = {}
    
    if "master_name" not in request.COOKIES:
        context["signings"] = Signing.objects.all()
        new_list = []
        for s in context["signings"]:
            if Procedure.objects.filter(id = s.procedure_id)[0].master_name == list_master[2]:
                new_list.append(s)
        context["signings"] = new_list
        context["master"] = list_master[2]
    else:
        context["signings"] = Signing.objects.all()
        new_list = []
        for s in context["signings"]:
            if Procedure.objects.filter(id = s.procedure_id)[0].master_name == list_master[master_id]:
                new_list.append(s)
        context["signings"] = new_list
        context["master"] = list_master[master_id]

    context["signings"] = sort_sign(context["signings"])

    response = render(request,"SalonSigoApp/magazine.html",context)
    if "master_name" not in request.COOKIES:
        master_id = 2
        response.set_cookie("master_name","2")
    else:
        response.set_cookie("master_name",master_id)
    if request.method == "POST":
        master_name = str(request.POST.get("master_name"))
        date = str(request.POST.get("date"))
            
        if master_name == 'None':
            master_name = list_master[master_id]
        else:
            master_id = list_master.index(master_name)

        all_signings = Signing.objects.all()
        signings_master = []
        signings = []
        for s in all_signings:
            if Procedure.objects.filter(id = s.procedure_id)[0].master_name == master_name:
                signings_master.append(s)
        
        for s in signings_master:
            if str(s.date) == date:
                signings.append(s) 
        
        signings = sort_sign(signings)

        data = {
            'html_sign_list': render_to_string( "SalonSigoApp/list_item.html",{ 
                'signings': signings
            })
        }
        
        return JsonResponse(data)
    
    return response

def show_add_signing(request):
    if request.user.is_authenticated:
        context = {
            "procedure":Procedure.objects.all()
        }

        if request.method == "POST":
            name_people = request.POST.get("namePeople")
            procedure = request.POST.get("procedure")
            date = request.POST.get("date")
            time = request.POST.get("time")
            Signing.objects.create(people_name=name_people,procedure=Procedure.objects.get(name=procedure),date=date,time=time)
            return JsonResponse({"result":True})
        return render(request,"SalonSigoApp/addSigning.html",context)
    
    else:
        return redirect(show_login)

def show_login(request):
    if request.method =='POST':
        name = request.POST.get("name")
        password = request.POST.get('password')
        
        user = authenticate(request, username = name, password = password)
        
        if user != None:
            login(request,user)
            return JsonResponse({"result":"true"})
        else:
            return JsonResponse({"result":"false"})
    return render(request,"SalonSigoApp/login.html")