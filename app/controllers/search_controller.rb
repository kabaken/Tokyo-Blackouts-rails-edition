class SearchController < ApplicationController
	def search
		res = {:address => '', :group => 0, :code => ''}
		queries = ActiveSupport::JSON.decode(params[:query])
		queries.each do |query|
			adds = AddressGroup.find_all_by_address(query)
			unless(adds.blank?)
				groups = []
				adds.each {|add| groups << {:group =>add.group_number, :subgroup => add.group_code}}
				res = {:address => adds[0].address, :group => groups}
				break
			end
		end
		respond_to do |format|
      format.xml { render :xml => res }
      format.json { render :json => res }
    end
	end
end
