from django.shortcuts import render,redirect, get_object_or_404
from .forms import LocalForm, ResenaForm, ReservaForm, ImagenLocalForm , SearchForm
from .models import ImagenLocal, Local
from django.contrib.auth.models import User



def index(request):
    return render(request, 'index.html' )
def locales(request):
    dates = Local.objects.all()

    first = ImagenLocal()
    return render(request,'locales/locales.html', {'dates':dates})



def alquilar_local(request):

    if request.method == 'POST':

        local_form = LocalForm(request.POST)
        if local_form.is_valid():

            local = local_form.save(commit=False)
            local.dueno = request.user  
            local.save()

            imagen_files = request.FILES.getlist('imagenes')
            for imagen in imagen_files:
                ImagenLocal.objects.create(local=local, imagen=imagen)
            return redirect('index')
    else:
        local_form = LocalForm()
        imagen_form = ImagenLocalForm()
    
    return render(request, 'locales/local.html', {'local_form': local_form, 'imagen_form': ImagenLocalForm()})

def LocalDetalles(request, pk):
    da = get_object_or_404( Local,id=pk)
    similar_locales = Local.objects.exclude(id=pk).order_by('?')[:8]
    return render(request,'locales/detalles.html', {'da':da,'similar_locales':similar_locales})

def crear_reserva(request):
    if request.method == 'POST':
        form = ReservaForm(request.POST)
        if form.is_valid():
            # Guarda la nueva reserva
            form.save()
            return redirect('index')  # Redirige al índice después de guardar
    else:
        form = ReservaForm()
    
    return render(request, 'locales/reserva.html', {'form': form})

def dejar_resena(request):
    if request.method == 'POST':
        form = ResenaForm(request.POST)
        if form.is_valid():
            # Guarda la nueva reseña
            form.save()
            return redirect('index')  # Redirige al índice después de guardar
    else:
        form = ResenaForm()
    
    return render(request, 'locales/resena.html', {'form': form})



def search(request):
    query = request.GET.get('q', '')  # Obtén el parámetro de búsqueda de la URL
    if query:
        # Filtra los locales por nombre, dirección, y descripción usando la búsqueda insensible a mayúsculas/minúsculas
        results = Local.objects.filter(
            nombre__icontains=query
        ) | Local.objects.filter(
            direccion__icontains=query
        ) | Local.objects.filter(
            descripcion__icontains=query
        )
    else:
        results = Local.objects.none()  # Si no hay consulta, no se muestran resultados

    return render(request, 'index.html', {'results': results})