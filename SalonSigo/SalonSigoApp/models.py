from django.db import models

class Procedure(models.Model):
    name = models.CharField(max_length=255)
    master_name = models.CharField(max_length=255,blank=True)
    image = models.ImageField()   
    def __str__(self):
        return self.name 

class Signing(models.Model):
    people_name = models.CharField(max_length=255)
    procedure = models.ForeignKey(Procedure,on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
