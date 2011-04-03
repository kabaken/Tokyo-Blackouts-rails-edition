class Schedule < ActiveRecord::Base
	has_many :schedule_members, :dependent => :destroy

	after_create :create_members

	# auto create default members
	def create_members
		(1..5).each do |group_number|
			%w[A B C D E].each do |group_code|
				ScheduleMember.create(:schedule_id => self.id, :group_number => group_number, :group_code => group_code, :state => '中止')
			end
		end
	end

	def to_label
		effect_at
	end
end
