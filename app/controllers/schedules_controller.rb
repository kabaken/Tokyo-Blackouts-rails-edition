class SchedulesController < ApplicationController
	def index
		schedules = Schedule.includes(:state).order('effect_at, group_number, group_code')
		respond_to do |format|
      format.xml { render :xml => schedules }
      format.json { render :json => schedules.to_json(:include => :state) }
    end
	end
end
