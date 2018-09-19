Sub calcTotalVol()
    Dim current_vol_sum As Double
    Dim current_tic As String
    Dim next_tic As String
    Dim ticker_count As Integer
    Dim lastrow As Long
    
    For Each ws In Worksheets
        lastrow = ws.Cells(Rows.Count, 1).End(xlUp).Row
        current_vol_sum = 0
        ticker_count = 1
        
        For i = 2 To lastrow
            current_tic = Cells(i, 1).Value
            next_tic = Cells(i + 1, 1).Value
            current_vol_sum = current_vol_sum + ws.Cells(i, 7).Value
            If (current_tic <> next_tic) Then
                ticker_count = ticker_count + 1
                ws.Cells(ticker_count, 9).Value = current_tic
                ws.Cells(ticker_count, 10).Value = current_vol_sum
                current_vol_sum = 0
            End If
        Next i
    Next ws

End Sub

