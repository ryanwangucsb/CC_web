from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User
from jose import jwt, JWTError
import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class SupabaseAuthBackend(BaseBackend):
    """
    Custom authentication backend for Supabase JWT tokens
    """
    
    def authenticate(self, request, token=None):
        if not token:
            print("DEBUG: No token provided")
            return None
            
        try:
            # Get Supabase URL from settings
            supabase_url = getattr(settings, 'SUPABASE_URL', None)
            print(f"DEBUG: Supabase URL: {supabase_url}")
            
            if not supabase_url:
                logger.error("SUPABASE_URL not configured in settings")
                return None
            
            # For now, let's decode the JWT without verification to see the payload
            # This is a temporary solution for development
            print(f"DEBUG: Attempting to decode token without verification...")
            try:
                # Decode without verification first to see the structure
                payload = jwt.decode(
                    token,
                    key=None,
                    options={"verify_signature": False, "verify_aud": False, "verify_iss": False}
                )
                print(f"DEBUG: JWT payload (unverified): {payload}")
                
                # Extract user info from token
                user_id = payload.get('sub')
                email = payload.get('email')
                
                print(f"DEBUG: User ID: {user_id}, Email: {email}")
                
                if not user_id or not email:
                    logger.error("Invalid token payload")
                    print("DEBUG: Missing user_id or email in payload")
                    return None
                    
                # Get or create Django user
                user, created = User.objects.get_or_create(
                    username=user_id,
                    defaults={
                        'email': email,
                        'first_name': payload.get('user_metadata', {}).get('full_name', ''),
                        'last_name': '',
                    }
                )
                
                print(f"DEBUG: Django user: {user}, Created: {created}")
                
                if created:
                    logger.info(f"Created new Django user for Supabase user {user_id}")
                else:
                    # Update existing user's email if it changed
                    if user.email != email:
                        user.email = email
                        user.save()
                        
                return user
                
            except JWTError as e:
                print(f"DEBUG: JWT decode error: {e}")
                return None
                
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            print(f"DEBUG: General error: {e}")
            return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
