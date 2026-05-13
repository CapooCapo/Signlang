from rest_framework.renderers import JSONRenderer

class CoreJSONRenderer(JSONRenderer):
    """
    Custom renderer to ensure all responses follow the standardized SignLang format:
    {
      "success": boolean,
      "status": int,
      "message": string,
      "object": any
    }
    """
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context['response']
        
        # If the response is already in our standard format (e.g. from res_message or exception_handler)
        if isinstance(data, dict) and all(k in data for k in ["success", "status", "message", "object"]):
            return super().render(data, accepted_media_type, renderer_context)
            
        # Wrap the response data
        standardized_data = {
            "success": 200 <= response.status_code < 300,
            "status": response.status_code,
            "message": "OK" if response.status_code < 300 else "Error",
            "object": data if data is not None else {}
        }
        
        # Handle cases where data is a dict with a 'detail' key (standard DRF errors)
        if isinstance(data, dict) and "detail" in data:
            standardized_data["message"] = data["detail"]
            
        return super().render(standardized_data, accepted_media_type, renderer_context)
