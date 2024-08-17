from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField


class Intereses(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500,blank=True)
    picture = models.ImageField(upload_to='imagen_del_perfil/',null=True,blank=True)
    website = models.URLField(null=True,blank=True)
    pais = CountryField(blank=True,null=True)
    birday = models.DateField(null=True, blank=True)
    intereses = models.ManyToManyField('Intereses', blank=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    
    def update_average_rating(self):
        ratings = self.ratings.all()
        self.average_rating = ratings.aggregate(models.Avg('value'))['value__avg'] or 0.0
        self.save()
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.user.username)
        super(Profile, self).save(*args, **kwargs)


    def __str__(self):
        return self.user



class Rating(models.Model):
    profile = models.ForeignKey(Profile, related_name='ratings', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} rated {self.profile.user.username} with {self.value}"

    class Meta:
        unique_together = ('profile', 'user')

class Comment(models.Model):
    profile = models.ForeignKey(Profile, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} commented on {self.profile.user.username}'s profile"