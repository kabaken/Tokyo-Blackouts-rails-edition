class VersionController < ApplicationController
	def index
		res = {:version => VERSION}
		respond_to do |format|
      format.html { render :text => VERSION }
      format.xml { render :xml => res }
      format.json { render :json => res }
    end
	end
end
