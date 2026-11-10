namespace Assigment2
{
    partial class BicycleRentalForm
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
            label1 = new Label();
            nudStart = new NumericUpDown();
            label2 = new Label();
            nudEnd = new NumericUpDown();
            btnCalculate = new Button();
            label3 = new Label();
            btnLogout = new Button();
            txtTotal = new TextBox();
            label4 = new Label();
            lblTariff = new Label();
            lstReceipt = new ListBox();
            btnBack = new Button();
            ((System.ComponentModel.ISupportInitialize)nudStart).BeginInit();
            ((System.ComponentModel.ISupportInitialize)nudEnd).BeginInit();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(46, 96);
            label1.Name = "label1";
            label1.Size = new Size(165, 22);
            label1.TabIndex = 0;
            label1.Text = "Starting hour (0-23):";
            label1.Click += label1_Click;
            // 
            // nudStart
            // 
            nudStart.Location = new Point(263, 96);
            nudStart.Maximum = new decimal(new int[] { 23, 0, 0, 0 });
            nudStart.Name = "nudStart";
            nudStart.Size = new Size(327, 29);
            nudStart.TabIndex = 1;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(46, 178);
            label2.Name = "label2";
            label2.Size = new Size(157, 22);
            label2.TabIndex = 2;
            label2.Text = "Ending hour (1-24):";
            // 
            // nudEnd
            // 
            nudEnd.Location = new Point(263, 171);
            nudEnd.Maximum = new decimal(new int[] { 24, 0, 0, 0 });
            nudEnd.Minimum = new decimal(new int[] { 1, 0, 0, 0 });
            nudEnd.Name = "nudEnd";
            nudEnd.Size = new Size(327, 29);
            nudEnd.TabIndex = 3;
            nudEnd.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // btnCalculate
            // 
            btnCalculate.BackColor = SystemColors.ActiveCaption;
            btnCalculate.ForeColor = Color.White;
            btnCalculate.Location = new Point(414, 230);
            btnCalculate.Name = "btnCalculate";
            btnCalculate.Size = new Size(176, 56);
            btnCalculate.TabIndex = 4;
            btnCalculate.Text = "Calculate";
            btnCalculate.UseVisualStyleBackColor = false;
            btnCalculate.Click += btnCalculate_Click;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(68, 323);
            label3.Name = "label3";
            label3.Size = new Size(48, 22);
            label3.TabIndex = 5;
            label3.Text = "Total";
            label3.Click += label3_Click;
            // 
            // btnLogout
            // 
            btnLogout.BackColor = Color.FromArgb(192, 0, 0);
            btnLogout.ForeColor = Color.White;
            btnLogout.Location = new Point(414, 385);
            btnLogout.Name = "btnLogout";
            btnLogout.Size = new Size(176, 58);
            btnLogout.TabIndex = 7;
            btnLogout.Text = " Logout";
            btnLogout.UseVisualStyleBackColor = false;
            btnLogout.Click += btnLogout_Click;
            // 
            // txtTotal
            // 
            txtTotal.Location = new Point(263, 323);
            txtTotal.Name = "txtTotal";
            txtTotal.ReadOnly = true;
            txtTotal.Size = new Size(327, 29);
            txtTotal.TabIndex = 6;
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Font = new Font("Calibri", 22.2F, FontStyle.Bold | FontStyle.Italic, GraphicsUnit.Point, 0);
            label4.Location = new Point(46, 9);
            label4.Name = "label4";
            label4.Size = new Size(225, 45);
            label4.TabIndex = 8;
            label4.Text = "Bicycle rental";
            label4.Click += label4_Click;
            // 
            // lblTariff
            // 
            lblTariff.AutoSize = true;
            lblTariff.Font = new Font("Consolas", 12F, FontStyle.Bold | FontStyle.Italic, GraphicsUnit.Point, 0);
            lblTariff.Location = new Point(689, 80);
            lblTariff.Name = "lblTariff";
            lblTariff.Size = new Size(142, 138);
            lblTariff.TabIndex = 9;
            lblTariff.Text = "Tariff\r\n00-07    500\r\n07-14   1000\r\n14-19   1500\r\n19-21   1000\r\n21-24    500";
            // 
            // lstReceipt
            // 
            lstReceipt.FormattingEnabled = true;
            lstReceipt.Location = new Point(640, 260);
            lstReceipt.Name = "lstReceipt";
            lstReceipt.SelectionMode = SelectionMode.None;
            lstReceipt.Size = new Size(230, 158);
            lstReceipt.TabIndex = 10;
            // 
            // btnBack
            // 
            btnBack.BackColor = Color.FromArgb(31, 58, 95);
            btnBack.BackgroundImageLayout = ImageLayout.None;
            btnBack.ForeColor = Color.White;
            btnBack.Location = new Point(50, 385);
            btnBack.Name = "btnBack";
            btnBack.Size = new Size(176, 58);
            btnBack.TabIndex = 11;
            btnBack.Text = "Back";
            btnBack.UseVisualStyleBackColor = false;
            btnBack.Click += btnBack_Click;
            // 
            // BicycleRentalForm
            // 
            AutoScaleDimensions = new SizeF(9F, 22F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(900, 495);
            Controls.Add(btnBack);
            Controls.Add(lstReceipt);
            Controls.Add(lblTariff);
            Controls.Add(label4);
            Controls.Add(btnLogout);
            Controls.Add(txtTotal);
            Controls.Add(label3);
            Controls.Add(btnCalculate);
            Controls.Add(nudEnd);
            Controls.Add(label2);
            Controls.Add(nudStart);
            Controls.Add(label1);
            Font = new Font("Calibri", 10.8F, FontStyle.Bold | FontStyle.Italic, GraphicsUnit.Point, 0);
            Name = "BicycleRentalForm";
            Text = "BicycleRentalForm";
            Load += BicycleRentalForm_Load;
            ((System.ComponentModel.ISupportInitialize)nudStart).EndInit();
            ((System.ComponentModel.ISupportInitialize)nudEnd).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        private NumericUpDown nudStart;
        private Label label2;
        private NumericUpDown nudEnd;
        private Button btnCalculate;
        private Label label3;
        private Button btnLogout;
        private TextBox txtTotal;
        private Label label4;
        private Label lblTariff;
        private ListBox lstReceipt;
        private Button btnBack;
    }
}