import re
from typing import List, Dict


def process_nav(request_path: str, data: Dict):
    for item in data.values():
        process_nav_item(request_path, item)


def process_nav_item(request_path: str, data: Dict):
    if 'content' in data:
        for item in data['content']:
            process_nav_item(request_path, item)
        data['is_active'] = any([item['is_active'] for item in data['content']])
    else:
        if 'url' in data:
            url = data['url']
            if not url.startswith("http") and not url.startswith('/'):
                url = '/' + url
            data['url'] = url

        if 'urlPattern' in data:
            data['is_active'] = bool(re.compile(data['urlPattern']).match(request_path))
        elif 'url' in data:
            data['is_active'] = request_path.startswith(data['url'])
        else:
            data['is_active'] = False


def process_video_nav(data: List[Dict]) -> List[Dict]:
    for item in data:
        process_video_nav_item(item)
    return data


def process_video_nav_item(data: Dict) -> Dict:
    if 'content' in data:
        for item in data['content']:
            process_video_nav_item(item)
    else:
        data['class'] = 'video-item'
        data['title_class'] = 'video-item-title'
        if is_external(data['url']):
            data['title_class'] += ' is_external'
        if 'description' in data:
            data['title_arguments'] = {
                'data-description': data['description']
            }
            del data['description']
    return data


def is_external(link: str):
    return 'www.youtube.com' not in link


def get_current_url(subnav: Dict) -> str:
    current = next((item for item in iter(subnav) if item['is_active']), None)

    if current and 'url' in current:
        return current['url']
    else:
        return '/'
