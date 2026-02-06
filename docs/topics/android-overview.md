<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="24dp">

    <TextView
        android:id="@+id/tvTitle"
        android:text="Guess the Number (1-10)"
        android:textSize="20sp"
        android:textStyle="bold"
        android:layout_marginBottom="16dp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>

    <EditText
        android:id="@+id/etGuess"
        android:hint="Enter your guess"
        android:inputType="number"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>

    <Button
        android:id="@+id/btnCheck"
        android:text="Check"
        android:layout_marginTop="16dp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>

    <TextView
        android:id="@+id/tvResult"
        android:text=""
        android:textSize="16sp"
        android:layout_marginTop="16dp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>

</LinearLayout>
