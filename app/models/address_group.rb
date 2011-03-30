class AddressGroup < ActiveRecord::Base
	require 'spreadsheet'
  require 'open-uri'

	has_many :schedule_members, :finder_sql => 'SELECT * FROM schedule_members WHERE group_number = #{group_number} AND group_code = "#{group_code}"'

	GROUP_NUMBER = [1, 2, 3, 4, 5]
  validates_inclusion_of :group_number, :in => GROUP_NUMBER
	GROUP_CODE = %w[A B C D E]
  validates_inclusion_of :group_code, :in => GROUP_CODE

	def AddressGroup::refresh
		targets = [	[:tochigi, '栃木県'], [:ibaraki, '茨城県'], [:gunma, '群馬県'], [:chiba, '千葉県'], [:kanagawa, '神奈川県'],
			[:tokyo, '東京都'], [:saitama, '埼玉県'], [:yamanashi, '山梨県'], [:numazu, '静岡県']]
		targets.each do |pref|
			url = "http://www.tepco.co.jp/images/#{pref[0]}.xls"
			begin
				file = open(url)
			rescue
				p "Can't open '#{url}'"
				next
			end
			p url
			transaction do
				delete_all(:pref => pref[1])
				book = Spreadsheet.open(file)
				sheet = book.worksheet 0
				sheet.each do |row|
					row.map! {|r| r.to_s.sub(/^[　\s]*(.*?)[　\s]*$/, '\1').sub(/大字/, '')}
					next unless row[0] == pref[1]
					gnum = row[3].to_i
					address = row[0] + row[1] + row[2]
					create(:pref => row[0], :address => address, :group_number => row[3].to_i, :group_code => row[4])
					p address
				end
			end
		end
	end

	def schedules
		res = []
		schedule_members.each do |s|
			res << {:date => s.effect_at, :status => s.state}
		end
		res
	end
end
