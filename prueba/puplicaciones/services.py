import time
import dropbox
from dropbox.exceptions import ApiError, AuthError

class DropboxService:
    def __init__(self, access_token):
        self.client = dropbox.Dropbox(access_token)

    def upload_image(self, file, path):
        max_retries = 3
        for attempt in range(max_retries):
            try:
                return self.client.files_upload(file.read(), path)
            except (ApiError, AuthError) as e:
                print(f"Dropbox API error: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2)  # Wait before retrying
                else:
                    raise
            except Exception as e:
                print(f"Unexpected error: {e}")
                raise
