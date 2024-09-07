import dropbox
from django.conf import settings
import uuid

class DropboxService:
    def __init__(self):
        self.client = dropbox.Dropbox(settings.DROPBOX_ACCESS_TOKEN)

    def upload_image(self, file, path):
        unique_path = self._generate_unique_path(path)
        self.client.files_upload(file.read(), unique_path)
        try:
            links = self.client.sharing_list_shared_links(path=unique_path).links
            if links:
                link = links[0]
            else:
                link = self.client.sharing_create_shared_link_with_settings(unique_path)
        except dropbox.exceptions.ApiError as e:
            if isinstance(e.error, dropbox.sharing.CreateSharedLinkWithSettingsError) and e.error.is_shared_link_already_exists():
                link = self.client.sharing_list_shared_links(path=unique_path).links[0]
            else:
                raise e
        return link.url.replace('?dl=0', '?raw=1')

    def delete_file(self, url):
        # Extraer el path de la URL
        path = self._extract_path_from_url(url)
        try:
            self.dbx.files_delete_v2(path)
            return True
        except Exception as e:
            print(f"Error al eliminar el archivo: {e}")
            return False

    def _extract_path_from_url(self, url):
        # Asumimos que la URL tiene la estructura de Dropbox y extraemos el path
        # Esta es una forma simplificada. Dependiendo de cómo está construida tu URL, puede necesitar ajustes.
        from urllib.parse import urlparse, parse_qs
        parsed_url = urlparse(url)
        path = parsed_url.path
        return path