from django import forms
 
class UserForm(forms.Form):
    text = forms.CharField()

    def clean(self):
        cleaned_data = super(UserForm, self).clean()