from fabric.api import env, local, run, cd, sudo, open_shell, settings
# For setting up SSH key on VM: https://help.github.com/articles/generating-ssh-keys/

env.user = ""
env.password = ""
env.hosts = ["classcapture.ncsa.illinois.edu"]

git_base_url = "https://github.com/cs-education/"
git_repo_name = "ClassCapture_Web"

def checkout():
    """
    Checkout the code on the VM, install npm/bower dependencies
    Also, changes current directory to the checked out repo
    """
    must_clone_repo = False
    with settings(warn_only=True): # makes it so that test -d won't cause an interruption if it fails
        must_clone_repo = run("test -d %s" % git_repo_name).failed
    if must_clone_repo:
        run("git clone %s%s.git" % (git_base_url, git_repo_name))
    with cd("~/%s" % git_repo_name):
        run("git pull origin master")
        # install bower/npm dependencies
        run("bower install")
        run("npm install")

def start_server():
    """
    Start the server on the VM
    Uses forever package to start it as a continuous daemon
    """
    with cd("~/%s" % git_repo_name):
        run("pm2 start app.json")

def reload_server(user, password, shell_after=True):
    """
    Restarts server...If its in cluster mode, will be able to reload with 0 downtime
    """
    env.user = user
    env.password = password

    checkout()
    with cd("~/%s" % git_repo_name):
        run("pm2 reload app.json")
    if shell_after:
        open_shell()

def update_frontend(user, password, shell_after=True):
    """
    Just rebuilds the application frontend files
    Server will then be able to just pull from the new files and display the front end updates
    If there are updates for the server itself that serves the frontend content, use `reload_server(...)`
    """
    env.user = user
    env.password = password

    checkout()
    with cd("~/%s" % git_repo_name):
        run("grunt build:dist --force")
    if shell_after:
        open_shell()

def deploy(user, password, shell_before=False, shell_after=True):
    env.user = user
    env.password = password
    if shell_before:
        open_shell()
    checkout()
    start_server()
    if shell_after:
        open_shell()