# group: Security
# name: Enforce Bash History
# description: Enforce safe Bash history for all users. Enforce timestamp for history.

patterns="HISTIGNORE=[\"'][\"']
HISTCONTROL=[\"'][\"']
HISTTIMEFORMAT=[\"'][^[:space:]]
HISTFILE=~/\.bash_history
HISTFILESIZE=[0-9][0-9]*
readonly\\ HISTFILE
readonly\\ HISTSIZE
readonly\\ HISTFILESIZE
readonly\\ HISTIGNORE
readonly\\ HISTCONTROL"

echo "$patterns" | while read p; do
	if ! grep -q "$p" /etc/profile /etc/bash.bashrc; then
		result_warning "Missing setting. Check for '$p' failed."
	fi
done

getent passwd |\
cut -d : -f 6 |\
xargs --replace={} ls {}/.bash_history 2>/dev/null |\
xargs lsattr |\
while read attr file; do
	if [[ ! $attr =~ a ]]; then
		result_warning "$file is not append-only."
	fi
done
