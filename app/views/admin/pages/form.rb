class Main
  module Views
    module Admin
      module Pages
        class Form < Mustache 
            
          def page_id
            @page.id  
          end      
          
        end
      end
    end
  end
end