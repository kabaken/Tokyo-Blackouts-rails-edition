set :application, "Tokyo-Blackouts-rails-edition"
set :repository,  "git@github.com:kabaken/Tokyo-Blackouts-rails-edition.git"

set :scm, :git

role :web, "teiden.dumdee.com"                          # Your HTTP server, Apache/etc
role :app, "teiden.dumdee.com"                          # This may be the same as your `Web` server
role :db,  "teiden.dumdee.com", :primary => true # This is where Rails migrations will run

set :deploy_via,  :copy
set :copy_exclude, [".git"]

set :use_sudo, true
set :password do Capistrano::CLI.password_prompt('Password: ') end
default_run_options[:pty] = true

set :keep_releases, 3
after "deploy:update", "deploy:cleanup"

set :deploy_to,   "/var/rails/tb"
set :branch,      'master'
set :copy_cache, "/tmp/deploy-cache/Tokyo-Blackouts-rails-edition"

namespace :deploy do
	task :restart, :roles => :app do
    run "ln -nfs #{shared_path}/sencha-touch #{release_path}/public/sencha-touch"
		run "#{try_sudo} /etc/init.d/unicorn upgrade"
	end
end
