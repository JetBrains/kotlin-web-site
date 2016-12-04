#!/bin/zsh
sed -i 's%href="/%href="/kotlin-web-site-ja/%g' **/*.html
sed -i 's%src="/%src="/kotlin-web-site-ja/%g' **/*.html
sed -i 's%url(/_assets/%url(/kotlin-web-site-ja/_assets%g' **/*.css
