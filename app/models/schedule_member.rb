class ScheduleMember < ActiveRecord::Base
	belongs_to :schedule

	STATE = %w[未定 実施 中止]
  validates_inclusion_of :state, :in => STATE

	def effect_at
		self.schedule.effect_at
	end
end
