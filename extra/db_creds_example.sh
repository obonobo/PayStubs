# The web server will need these as environment variables for configuration
# You can put them in the script and source it or even better:
#   1. Copy all text after the 'export'
#   2. On CLI, enter 1 space (very important step!)
#   3. Paste the env vars and then type 'npm start'
# 
# This does 2 things. Firstly, we can specify the environment variables 
# during the command to start the web server. Secondly, the space that
# we prepend to the command will prevent the command from being saved 
# in bash history (viewable with the 'history' command, or in file ~/.bash_history).
export DB_USER='username' DB_PASS='password' DB_IP='ipaddress' DB_PORT='port' DB_NAME='dbname' LOG_LEVEL='debug'
