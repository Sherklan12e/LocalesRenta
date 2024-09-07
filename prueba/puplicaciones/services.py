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

    def delete_image(self, path):
        try:
            self.client.files_delete_v2(path)
        except dropbox.exceptions.ApiError as e:
            print(f"Error deleting file: {e}")

    def _generate_unique_path(self, path):
        file_name, file_extension = path.rsplit('.', 1)
        unique_id = str(uuid.uuid4())
        return f"{file_name}_{unique_id}.{file_extension}"
