from django.shortcuts import render , redirect
from .forms import RegisterForm
from django.contrib.auth import login as ingreso
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import logout


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request,data=request.POST)
        
        if form.is_valid():
            user = form.get_user()
            ingreso(request,user)
            if not request.POST.get('remember_me'):
                request.session.set_expiry(0)  
            else:
                request.session.set_expiry(1209600) 
            return redirect('index')
    else:
        form = AuthenticationForm()
    


    return render(request,'accounts/login.html')


def register(request):

    if request.method== 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            ingreso(request,user)
            return redirect('index')
    else:
        form = RegisterForm()
        

    return render(request,'accounts/register.html',{'form':form})
def salir(request):

    logout(request)
    return redirect('index')