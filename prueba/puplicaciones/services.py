import dropbox
from django.conf import settings

class DropboxService:
    def __init__(self):
        self.client = dropbox.Dropbox(settings.DROPBOX_ACCESS_TOKEN)

    def upload_image(self, file, path):
        # Upload the file
        self.client.files_upload(file.read(), path)

        # Check if a shared link already exists
        try:
            links = self.client.sharing_list_shared_links(path=path).links
            if links:
                link = links[0]
            else:
                link = self.client.sharing_create_shared_link_with_settings(path)
        except dropbox.exceptions.ApiError as e:
            # Handle the specific case of shared link already existing
            if isinstance(e.error, dropbox.sharing.CreateSharedLinkWithSettingsError) and e.error.is_shared_link_already_exists():
                link = self.client.sharing_list_shared_links(path=path).links[0]
            else:
                raise e

        # Return the direct URL
        return link.url.replace('?dl=0', '?raw=1')
