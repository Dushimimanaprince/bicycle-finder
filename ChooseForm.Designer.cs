namespace Assigment2
{
    partial class ChooseForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            btnBicycle = new Button();
            btnMushroom = new Button();
            lblTitle = new Label();
            btnLogout = new Button();
            SuspendLayout();
            // 
            // btnBicycle
            // 
            btnBicycle.BackColor = SystemColors.AppWorkspace;
            btnBicycle.Location = new Point(143, 146);
            btnBicycle.Margin = new Padding(4);
            btnBicycle.Name = "btnBicycle";
            btnBicycle.Size = new Size(232, 153);
            btnBicycle.TabIndex = 0;
            btnBicycle.Text = "BicycleRentalProgram";
            btnBicycle.UseVisualStyleBackColor = false;
            btnBicycle.Click += btnBicycle_Click;
            // 
            // btnMushroom
            // 
            btnMushroom.BackColor = SystemColors.GradientInactiveCaption;
            btnMushroom.Location = new Point(562, 146);
            btnMushroom.Margin = new Padding(4);
            btnMushroom.Name = "btnMushroom";
            btnMushroom.Size = new Size(241, 153);
            btnMushroom.TabIndex = 1;
            btnMushroom.Text = "MushroomGuessProgram";
            btnMushroom.UseVisualStyleBackColor = false;
            btnMushroom.Click += btnMushroom_Click;
            // 
            // lblTitle
            // 
            lblTitle.AutoSize = true;
            lblTitle.Font = new Font("Calibri", 24F, FontStyle.Bold | FontStyle.Italic, GraphicsUnit.Point, 0);
            lblTitle.Location = new Point(229, 32);
            lblTitle.Name = "lblTitle";
            lblTitle.Size = new Size(477, 49);
            lblTitle.TabIndex = 2;
            lblTitle.Text = "What would you like to do?";
            lblTitle.Click += label1_Click;
            // 
            // btnLogout
            // 
            btnLogout.BackColor = Color.Red;
            btnLogout.Location = new Point(640, 416);
            btnLogout.Margin = new Padding(4);
            btnLogout.Name = "btnLogout";
            btnLogout.Size = new Size(163, 54);
            btnLogout.TabIndex = 3;
            btnLogout.Text = "Logout";
            btnLogout.UseVisualStyleBackColor = false;
            btnLogout.Click += btnLogout_Click;
            // 
            // ChooseForm
            // 
            AutoScaleDimensions = new SizeF(10F, 24F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1000, 540);
            Controls.Add(btnLogout);
            Controls.Add(lblTitle);
            Controls.Add(btnMushroom);
            Controls.Add(btnBicycle);
            Font = new Font("Calibri", 12F, FontStyle.Bold | FontStyle.Italic, GraphicsUnit.Point, 0);
            Margin = new Padding(4);
            Name = "ChooseForm";
            Text = "ChooseForm";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button btnBicycle;
        private Button btnMushroom;
        private Label lblTitle;
        private Button btnLogout;
    }
}