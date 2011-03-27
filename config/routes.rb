Tb::Application.routes.draw do
	match 'search' => 'search#search'
	match 'schedules' => 'schedules#index'
end
