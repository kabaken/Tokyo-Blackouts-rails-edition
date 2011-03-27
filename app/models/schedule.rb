class Schedule < ActiveRecord::Base
	belongs_to :state

	GROUP_NUMBER = [1, 2, 3, 4, 5]
  validates_inclusion_of :group_number, :in => GROUP_NUMBER
	GROUP_CODE = %w[A B C D E]
  validates_inclusion_of :group_code, :in => GROUP_CODE
end
