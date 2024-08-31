# services.py
import dropbox
from django.conf import settings

class DropboxService:
    def __init__(self):
        self.client = dropbox.Dropbox(settings.DROPBOX_ACCESS_TOKEN)

    def upload_image(self, file, path):
        self.client.files_upload(file.read(), path)
        link = self.client.sharing_create_shared_link_with_settings(path)
        return link.url.replace('?dl=0', '?raw=1')
