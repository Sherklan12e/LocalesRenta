from django import forms
from .models import Local, Resena,Reserva,ImagenLocal
from django_countries.widgets import CountrySelectWidget
class LocalForm(forms.ModelForm):
    class Meta:
        model = Local
        fields = ['nombre', 'direccion', 'descripcion','precio_dia','esta_disponible', 'country']
        widgets = {
            'country': CountrySelectWidget(attrs={
                'class': 'block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring'
            }),
        }

class ReservaForm(forms.ModelForm):
    class Meta:
        model = Reserva
        fields = ['usuario','local','dia_comienzo','final_dia', 'totalpagar']

class ResenaForm(forms.ModelForm):
    class Meta:
        model = Resena
        fields = ['usuario','local','clasificacion', 'comment']
class ImagenLocalForm(forms.ModelForm):
    class Meta:
        model = ImagenLocal
        fields = ['imagen']
class SearchForm(forms.Form):
    query = forms.CharField(max_length=255, required=False, label='Search')