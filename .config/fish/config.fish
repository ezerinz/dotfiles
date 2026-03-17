if status is-interactive
    # Commands to run in interactive sessions can go here
end

set PATH $HOME/.puro/bin/ $PATH
set PATH $HOME/.puro/envs/default/flutter/bin/ $PATH
set PATH $HOME/.puro/shared/pub_cache/bin $PATH
set PATH $HOME/.config/composer/vendor/bin $PATH
set PATH $HOME/bin $PATH

# bun
set --export BUN_INSTALL "$HOME/.bun"
set --export PATH $BUN_INSTALL/bin $PATH
