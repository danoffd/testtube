class WelcomeController < ApplicationController
  # load_and_authorize_resource

  def index

    # if the user had been invited to projects, and is registering for the first
    # time, he'll hit this page first upon redirection from oauth services.
    # Check to see if there are invitations waiting for him, automatically 
    # accept them by changing the project user from the invitee relation to the
    # user relation.
    if !current_user.nil?
      @invitations = Project.invited_to(current_user.email)
      if @invitations.any?
        flash[:notice] = "Automatically accepted " + @invitations.count.to_s + " invitation(s) to projects you have been invited to"

        @invitations.each do |project|
          project.project_users.each do |project_user|
            if !project_user.invitee.nil? && project_user.invitee.email == current_user.email
              project_user.invitee.delete
              project_user.user = current_user
              project_user.save
            end
          end
        end
      end
      puts "*********** Accepting Invitations: " + @invitations.inspect
    end

  end
end
