from fabric.api import env, local, run, cd, sudo, open_shell, settings

env.user = ""
env.password = ""
env.hosts = ["classcapture1.cs.illinois.edu"]

git_base_url = "https://github.com/sourabhdesai/"
git_repo_name = "ClassCapture_Web"

def test():
    """
    runs tests locally
    """
    local("npm test")

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
    cd(git_repo_name)
    run("git checkout origin master")
    # install bower/npm dependencies
    run("bower install")
    run("npm install")

def start_server():
    """
    Start the server on the VM
    Uses forever package to start it as a continuous daemon
    """
    run("forever -c \"grunt serve:dist\" .")

def deploy(user, password, shell_before=False, shell_after=True):
    env.user = user
    env.password = password
    test()
    if shell_before:
        open_shell()
    checkout()
    start_server()
    if shell_after:
        open_shell()