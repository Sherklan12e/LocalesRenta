from django import forms
from .models import Local, Resena,Reserva,ImagenLocal
from django_countries.widgets import CountrySelectWidget
class LocalForm(forms.ModelForm):
    class Meta:
        model = Local
        fields = ['nombre', 'direccion', 'descripcion','precio_dia','esta_disponible', 'country']
        widgets = {
            'country': CountrySelectWidget(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
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