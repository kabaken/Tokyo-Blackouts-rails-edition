class ScheduleMember < ActiveRecord::Base
	belongs_to :schedule

	STATE = %w[未定 実施 中止]
  validates_inclusion_of :state, :in => STATE
	GROUP_NUMBER = [1, 2, 3, 4, 5]
  validates_inclusion_of :group_number, :in => GROUP_NUMBER
	GROUP_CODE = %w[A B C D E]
  validates_inclusion_of :group_code, :in => GROUP_CODE

	def effect_at
		self.schedule.effect_at
	end
end
