Tb::Application.routes.draw do
	match 'search' => 'search#search'
	match 'version' => 'version#index'
end
