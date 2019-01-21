def assert_valid_git_hub_url(edit_on_github_url: str, page_path: str):
    # Do you like to include yet another organization? Thing twice :)

    url_lower = edit_on_github_url.lower()

    assert \
        url_lower.startswith('https://github.com/'.lower()), \
        'Check `edit_on_github_url` for `' + page_path + "` to be either `JetBrains` or `kotlin` "

